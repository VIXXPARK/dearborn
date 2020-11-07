from dearbornapps.models.post import Post, PostImage
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import glob, os.path, json
import boto3, os
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
    
    """Useage:
    
        images = S3Images(aws_access_key_id='fjrn4uun-my-access-key-589gnmrn90', 
                          aws_secret_access_key='4f4nvu5tvnd-my-secret-access-key-rjfjnubu34un4tu4', 
                          region_name='eu-west-1')
        im = images.from_s3('my-example-bucket-9933668', 'pythonlogo.png')
        im
        images.to_s3(im, 'my-example-bucket-9933668', 'pythonlogo2.png')
    """
    
    def __init__(self, aws_access_key_id, aws_secret_access_key, region_name):
        self.s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, 
                                     aws_secret_access_key=aws_secret_access_key, 
                                     region_name=region_name)
        

    def from_s3_non_image(self, bucket, key):#buffer BytesIO사용
        file_byte_string = self.s3.list_objects(Bucket=bucket, Prefix=key)
        buffer = BytesIO(file_byte_string)
        buffer.seek(0)
        obj = buffer.read()
        return obj

    def from_s3(self, bucket, key):
        file_byte_string = self.s3.get_object(Bucket=bucket, Key=key)['Body'].read()
        img = Image.open(BytesIO(file_byte_string))
        return img

    def to_s3_image(self, img, bucket, key):
        buffer = BytesIO()
        img.save(buffer, self.__get_safe_ext(key))
        buffer.seek(0)
        sent_data = self.s3.put_object(Bucket=bucket, Key=key, Body=buffer)
        if sent_data['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise S3ImagesUploadFailed('Failed to upload image {} to bucket {}'.format(key, bucket))
        
    def to_s3(self, obj, bucket, key):
        buffer = BytesIO()
        buffer.write(obj)
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

# def upload_file_to_bucket(file_name, s3_file):
#     ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
#     SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
#     bucket = os.getenv('AWS_STORAGE_BUCKET_NAME')
#     s3 = boto3.client('s3', aws_access_key=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY)
#     try:
#         s3.upload_file(file_name, bucket, s3_file)
#         return True
#     except FileNotFoundError:
#         return False
#     except:
#         return False

def download_all_files():
    ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
    SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    region_name = os.getenv('AWS_S3_REGION_NAME')
    s3Images = S3Images(aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_ACCESS_KEY,region_name=region_name)
    obj = s3Images.from_s3_non_image("dearbornstorage",'feature_vectors/')
    
    return obj
        

def featureUpload_to(postId):
   return 'feature_vectors/{0}'.format(postId)

def ChangeImage(images):
    image_array = []
    for img in images:
        image = tf.image.resize(img, [224, 224])
        image = tf.image.convert_image_dtype(image, tf.float32)
        image_array.append(image)
        print("---------check---------")
        print(image)
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
            image_id.append(Post.id)
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
            image_id.append(Post.id)
            file_name = os.path.basename(post.thumbnail.url).split('.')[0]
            dir = url.split('/')
            dir = dir[-4:]
            path = os.path.join('media',dir[0],dir[1],dir[2],dir[3])
            image = s3Images.from_s3("dearbornstorage",path)
            image_array = np.array(image)
            print(image_array)
            images.append(image_array)
            image_file_name.append(file_name)
        image_array_resized = ChangeImage(images)
    return image_array_resized, image_file_name, image_id

def GetFeatureVector(image_array):
    hub_path = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/feature_vector/4"
    
    MyModule = hub.KerasLayer(hub_path, input_shape = [224,224,3], trainable=False)
    
    featureVector = []
    result = MyModule(image_array)
    for res in result:
        result_set = np.squeeze(res)
        featureVector.append(result_set)
    
    return featureVector

def SaveFeatureVector(featureVector, image_file_name, postId):
    if Is_Local[0]:
        for index, v in enumerate(featureVector):
            dirs = featureUpload_to(postId).split('/')
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
            dirs = featureUpload_to(postId).split('/')
            out_path = ""
            for dir in dirs:
                out_path = os.path.join(out_path, dir)
            out_path = os.path.join(out_path,image_file_name[index] + ".npz")
            print(out_path)
            s3Images.to_s3(v,"dearbornstorage",out_path)

def Similarity(postId):

    dims = 1280
    n_nearest_neighbors = 1
    trees = 10000

    image_array, image_file_name, image_id = GetImageArray(postId)
    vectors = GetFeatureVector(image_array)
    
    if not Is_Local[0]:
        feature_vectors = download_all_files()
    else: 
        feature_vectors = glob.glob('feature_vectors/*/*.npz')
    
    n_nearest_neighbors = len(feature_vectors)

    annoy = AnnoyIndex(dims,'angular')
    for index, v in enumerate(feature_vectors):
        annoy.add_item(index, v)
    annoy.build(trees)
    similarities = []
    for index, v in enumerate(vectors):
        nearest_neighbors = annoy.get_nns_by_vector(v, n_nearest_neighbors)
        for neighbor in nearest_neighbors:
            similarity = 1 - spatial.distance.cosine(v, tested[neighbor])
            rounded_similarity = int((similarity * 10000)) / 10000.0
            similarity_set = {
                'similarity' : similarity,
                'postId' : image_id[index]
            }
            similarities.append(similarity_set)
    return similarities