from .models import Post, PostImage
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import glob, os.path, json
from annoy import AnnoyIndex
from scipy import spatial
from backend.settings import BASE_DIR


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

def GetImageArray(postId):
    images = PostImage.objects.filter(post = postId)
    image_urls = []
    image_file_name = []
    image_id = []
    for image in  images:
        url = image.image.url
        image_urls.append(url)
        image_id.append(image.id)
        file_name = os.path.basename(url).split('.')[0]
        print(file_name)
        image_file_name.append(file_name)
    image_array = LoadImage(image_urls)
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

def SaveFeatureVector(featureVector, image_file_name):
    for index, v in featureVector:
        out_dir = os.path.join(BASE_DIR,'feature_vectors')
        CheckDir(out_dir)
        out_path = os.path.join(out_dir,image_file_name[index] + ".npz")
        np.savetxt(out_path, v, delimiter=',')

def Similarity(postId):

    dims = 1280
    n_nearest_neighbors = 1
    trees = 10000

    image_array, image_file_name, image_id = GetImageArray(postId)
    vectors = GetFeatureVector(image_array)
    SaveFeatureVector(vectors, image_file_name)
    
    feature_vectors = glob.glob('feature_vectors/*.npz')
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
                'imageId' : image_id[index]
            }
            similarities.append(similarity_set)
    return similarities
    
    
 