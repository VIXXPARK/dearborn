from dearbornapps.models.post import Post, PostImage
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import glob, os.path, json
import boto3, os, pickle
from annoy import AnnoyIndex
from scipy import spatial
from dearbornConfig.settings.base import BASE_DIR, Is_Local
from io import BytesIO
from PIL import Image


class S3ImagesInvalidExtension(Exception):
    pass

class S3ImagesUploadFailed(Exception):
    pass

class S3Images(object):


    
    def __init__(self, aws_access_key_id, aws_secret_access_key, region_name):
        self.s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, 
                                     aws_secret_access_key=aws_secret_access_key, 
                                     region_name=region_name)
        

    def from_s3_non_image(self, bucket, key):
        contents = self.s3.list_objects(Bucket=bucket, Prefix=key)['Contents']
        keys = []
        for content in contents:
            keys.append(content['Key'])
        results = []
        keys = keys[1:]
        for ObjKey in keys:
            response = self.s3.get_object(Bucket=bucket, Key=ObjKey)
            body_string = response['Body'].read()
            np_array = pickle.loads(body_string)
            results.append(np_array)
        return results, keys

    def from_s3(self, bucket, key):
        file_byte_string = self.s3.get_object(Bucket=bucket, Key=key)['Body'].read()
        img = Image.open(BytesIO(file_byte_string))
        img = img.convert('RGB')
        img_array = np.asarray(img)
        return img_array

    def to_s3_image(self, img, bucket, key):
        buffer = BytesIO()
        img.save(buffer, self.__get_safe_ext(key))
        buffer.seek(0)
        sent_data = self.s3.put_object(Bucket=bucket, Key=key, Body=buffer)
        if sent_data['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise S3ImagesUploadFailed('Failed to upload image {} to bucket {}'.format(key, bucket))
        
    def to_s3(self, obj, bucket, key):
        buffer = BytesIO()
        pickle.dump(obj, buffer)
        buffer.seek(0)
        sent_data = self.s3.put_object(Bucket=bucket, Key=key, Body=buffer)
        if sent_data['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise S3ImagesUploadFailed('Failed to upload image {} to bucket {}'.format(key, bucket))

    def __get_safe_ext(self, key):
        ext = os.path.splitext(key)[-1].strip('.').upper()
        if ext in ['JPG', 'JPEG']:
            return 'JPEG' 
        elif ext in ['PNG']:
            return 'PNG' 
        else:
            raise S3ImagesInvalidExtension('Extension is invalid') 

def download_all_files(category):
    ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
    SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    region_name = os.getenv('AWS_S3_REGION_NAME')
    s3Images = S3Images(aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_ACCESS_KEY,region_name=region_name)
    obj, keys = s3Images.from_s3_non_image("dearbornstorage",featureDownload_from(category))
    
    return obj, keys
        
def featureDownload_from(category):
    return 'feature_vectors/{0}' .format(category)

def featureDownload_from_local(category):
    return 'feature_vectors\{0}' .format(category)

def featureUpload_to(postId,category):
   return 'feature_vectors/{0}/{1}'.format(category, postId)

def ChangeImage(images):
    image_array = []
    for img in images:
        image = tf.image.resize(img, [224, 224])
        image = tf.image.convert_image_dtype(image, tf.float32)
        image_array.append(image)
    return image_array


def LoadImage(image_urls):
    image_array = []
    for path in image_urls:
        image = tf.io.read_file(path)        
        image = tf.image.decode_image(image, channels=3)
        image = tf.image.resize(image, [224, 224])
        image = tf.image.convert_image_dtype(image, tf.float32)
        image_array.append(image)
    return image_array


def CheckDir(path):
    try:
        if not (os.path.isdir(path)):
            os.makedirs(path)
    except OSError as e:
        print(e.strerror)

def GetImageArray(postId):
    posts = Post.objects.filter(id = postId)
    if Is_Local[0]:
        image_urls = []
        image_file_name = []
        image_id = []
        for post in  posts:
            url = post.thumbnail.url
            dirs = url.split('/')
            path = os.path.join(BASE_DIR)
            for dir in dirs:
                path = os.path.join(path, dir)
            image_urls.append(path)
            image_id.append(post.id)
            file_name = os.path.basename(path).split('.')[0]
            image_file_name.append(file_name)
        image_array_resized = LoadImage(image_urls)
    else:
        image_file_name = []
        image_id = []
        images = []
        ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
        SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
        region_name = os.getenv('AWS_S3_REGION_NAME')
        s3Images = S3Images(aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_ACCESS_KEY,region_name=region_name)
        
        for post in  posts:
            url = post.thumbnail.url
            image_id.append(post.id)
            file_name = os.path.basename(post.thumbnail.url).split('.')[0]
            dir = url.split('/')
            dir = dir[-4:]
            path = os.path.join('media',dir[0],dir[1],dir[2],dir[3])
            print(path)
            image_array = s3Images.from_s3("dearbornstorage",path)
            image_array = nbp
            print(image_array)
            print(image_array.shape)
            images.append(image_array)
            image_file_name.append(file_name)
        image_array_resized = ChangeImage(images)
    return image_array_resized, image_file_name, image_id

def GetFeatureVector(image_array):
    hub_path = "https://tfhub.dev/google/imagenet/resnet_v2_50/feature_vector/4"
    print(image_array)
    MyModule = hub.KerasLayer(hub_path, input_shape = [224,224,3], trainable=False)
    featureVector = []
    result = MyModule(image_array)
    for res in result:
        result_set = np.squeeze(res)
        featureVector.append(result_set)
    
    return featureVector

def SaveFeatureVector(featureVector, image_file_name, postId, category):
    if Is_Local[0]:
        for index, v in enumerate(featureVector):
            dirs = featureUpload_to(postId, category).split('/')
            out_path = os.path.join(BASE_DIR)
            for dir in dirs:
                out_path = os.path.join(out_path, dir)
            CheckDir(out_path)
            out_path = os.path.join(out_path,image_file_name[index] + ".npz")
            np.savetxt(out_path, v, delimiter=',')
    else :
        for index, v in enumerate(featureVector):
            ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
            SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
            region_name = os.getenv('AWS_S3_REGION_NAME')
            s3Images = S3Images(aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_ACCESS_KEY,region_name=region_name)
            dirs = featureUpload_to(postId, category).split('/')
            out_path = ""
            for dir in dirs:
                out_path = os.path.join(out_path, dir)
            out_path = os.path.join(out_path,image_file_name[index] + ".pkl")
            
            s3Images.to_s3(v,"dearbornstorage",out_path)



def Similarity(vectors, n_nearest_neighbors, category):

    dims = 2048
    trees = 10000
    
    if not Is_Local[0]:
        feature_vectors, fileNames = download_all_files(category)
    else: 
        dir = featureDownload_from_local(category) + "\\*\\*.npz"
        feature_vectors = glob.glob(os.path.join(BASE_DIR,dir))

    annoy = AnnoyIndex(dims,'angular')
    if Is_Local[0]:
        loadedVectors = []
        fileNames = []
        for index, v in enumerate(feature_vectors):
            dir = v.split('\\')
            dir = dir[-2:-1]        
            fileNames.append(dir[0])
            vector = np.loadtxt(v)
            loadedVectors.append(vector)
            annoy.add_item(index, vector)
        feature_vectors = loadedVectors
    else:
        for index, v in enumerate(feature_vectors):
            annoy.add_item(index, v)


    annoy.build(trees)
    similarities = []
    for index, v in enumerate(vectors):
        nearest_neighbors, distance = annoy.get_nns_by_vector(v, n_nearest_neighbors, include_distances=True)
        for index, neighbor in enumerate(nearest_neighbors):
            print("index = ", index)
            print("neighbor = ", neighbor)
            similarity = 1 - (distance[index] * 10000) / 10000
            if Is_Local[0]:
                filename = fileNames[neighbor]
                similarity_set = {
                'similarity' : similarity,
                'postId' : filename,
                } 
            else:
                filename = fileNames[neighbor]
                nameList = filename.split('/')
                nameList = nameList[-2:-1]
                similarity_set = {
                'similarity' : similarity,
                'postId' : nameList[0],
                }
            similarities.append(similarity_set)
    return similarities
