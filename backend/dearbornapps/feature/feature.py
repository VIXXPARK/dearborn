from dearbornapps.models.post import Post, PostImage
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import glob, os.path, json
import boto3, os
from annoy import AnnoyIndex
from scipy import spatial
from dearbornConfig.settings.base import BASE_DIR, Is_Local


def get_objects_in_folder(path):
    from dearbornConfig.settings.production import AWS_S3_CUSTOM_DOMAIN
    ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
    SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket = os.getenv('AWS_STORAGE_BUCKET_NAME')
    region_name = os.getenv('AWS_S3_REGION_NAME')

    session = boto3.session.Session()
    client = session.client('s3', region_name=region_name,
                                  aws_access_key_id=ACCESS_KEY,
                                  aws_secret_access_key=SECRET_ACCESS_KEY,
    )
    objects = client.list_objects_v2(
        Bucket=bucket,
        EncodingType='url',
        MaxKeys=1000,
        Prefix=path,
    )
    return objects

def upload_file_to_bucket(file_name, s3_file):
    ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
    SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket = os.getenv('AWS_STORAGE_BUCKET_NAME')
    s3 = boto3.client('s3', aws_access_key=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY)
    try:
        s3.upload_file(file_name, bucket, s3_file)
        return True
    except FileNotFoundError:
        return False
    except:
        return False

def download_all_files():
    from dearbornConfig.settings.production import AWS_S3_CUSTOM_DOMAIN
    ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
    SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket = os.getenv('AWS_STORAGE_BUCKE')
    region_name = os.getenv('AWS_S3_REGION_NAME')

    session = boto3.session.Session()
    client = session.client('s3', region_name=region_name,
                                  aws_access_key_id=ACCESS_KEY,
                                  aws_secret_access_key=SECRET_ACCESS_KEY,
    )
    objects = client.list_objects_v2(
        Bucket=bucket,
        EncodingType='url',
        MaxKeys=1000,
        Prefix='feature_vectors',
    )
    return objects
        

def featureUpload_to(postId,filename):
   return 'feature_vector/{0}/{1}'.format(postId ,filename)

def ChangeImage(images):
    image_array = []
    for image in images:
        image = tf.image.decode_image(image)
        image = tf.image.resize(image, [224, 224])
        image = tf.image.convert_image_dtype(image, tf.float32)
        image_array.append(image)
    return image_array


def LoadImage(image_urls):
    image_array = []
    for path in image_urls:
        image = tf.io.read_file(path)
        image = tf.image.decode_image(image)
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

def GetImageArray(postId):#이부분 수정
    posts = Post.objects.filter(id = postId)
    print("---------------------\n",Is_Local)
    if Is_Local[0]:
        print("Is Local = ",Is_Local[0])
        image_urls = []
        image_file_name = []
        image_id = []
        for post in  posts:
            url = post.thumbnail.url
            image_urls.append(url)
            image_id.append(Post.id)
            file_name = os.path.basename(url).split('.')[0]
            image_file_name.append(file_name)
        image_array = LoadImage(image_urls)
    else:
        print("Is Local = ",Is_Local[0])
        image_file_name = []
        image_id = []
        images = []
        for post in  posts:
            url = post.thumbnail.url
            image_id.append(Post.id)
            file_name = os.path.basename(url).split('.')[0]
            dir = url.split('/')
            objects = get_objects_in_folder(os.path.join('media',dir[0],dir[1],dir[2]))
            images.append(objects)
            print('-----------check---------')
            print(objects)
            image_file_name.append(file_name)
        image_array = ChangeImage(images)
    return image_array, image_file_name, image_id

def GetFeatureVector(image_array):
    hub_path = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/feature_vector/4"
    MyModule = hub.KerasLayer(hub_path, input_shape = [224,224,3], trainable=False)
    featureVector = []
    for array in image_array:
        result = MyModule(array)
        result_set = np.squeeze(result)
        featureVector.append(result_set)
    return featureVector

def SaveFeatureVector(featureVector, image_file_name, postId):
    for index, v in featureVector:
        if not Is_Local[0]:
            upload_file_to_bucket(v,'{0}/{1}'.format(postId,image_file_name[index]+".npz"))
        else :
            out_dir = os.path.join(BASE_DIR,'feature_vectors')
            CheckDir(out_dir)
            out_path = os.path.join(BASE_DIR,featureUpload_to(postId, image_file_name[index]) + ".npz")
            np.savetxt(out_path, v, delimiter=',')

def Similarity(postId):

    dims = 1280
    n_nearest_neighbors = 1
    trees = 10000

    image_array, image_file_name, image_id = GetImageArray(postId)
    vectors = GetFeatureVector(image_array)
    
    if not Is_Local[0]:
        feature_vectors = download_all_files()
    else: 
        feature_vectors = glob.glob('feature_vectors/*.npz')
    
    n_nearest_neighbors = feature_vectors.count()

    annoy = AnnoyIndex(dims,'angular')
    for index, v in feature_vectors:
        annoy.add_item(index, v)
    annoy.build(trees)
    similarities = []
    for index, v in vectors:
        nearest_neighbors = t.get_nns_by_vector(v, n_nearest_neighbors)
        for neighbor in nearest_neighbors:
            similarity = 1 - spatial.distance.cosine(v, tested[neighbor])
            rounded_similarity = int((similarity * 10000)) / 10000.0
            similarity_set = {
                'similarity' : similarity,
                'postId' : image_id[index]
            }
            similarities.append(similarity_set)
    return similarities
    
    
 