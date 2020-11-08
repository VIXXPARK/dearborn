from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from models import Post, PostImage
from serializers.extraction import CategorySerializer, FilterSerializer, SaveTasteSerializer
from feature.feature import Similarity

@api_view(["POST"])
def getCategory(request):
    catSerializer = categorySerializer(data=request.data)
    if not catSerializer.is_valid():
        return Response({'success':False, 'err':catSerializer.errors}, status=HTTP_400_BAD_REQUEST)

    category = catSerializer.validated_data['category']
    postsObj = Post.objects.filter(category=category)
    posts = []
    for post in postsObj:
        postsContext = {
            'postId' : post.id,
            'thumbnail' : post.thumbnail.url,
        } 
        posts.append(postsContext)
    return Response({'success' : True, 'posts' : posts},status = HTTP_200_OK)

@api_view(["POST"])
def selectFilter(request):
    filterSerializer = FilterSerializer(data=request.data)
    if not filterSerializer.is_valid():
        return Response({'success':False, 'err':filterSerializer.errors}, status=HTTP_400_BAD_REQUEST)
    postList = filterSerializer.validated_data['postList']
    posts = []
    for post in postList:
        similarities = Similarity(post)
        for sim in similarities:
            similarity = sim['similarity']
            if similarity >= 0.5:
                posts.append(sim['postId'])
    tmp = set(posts)
    posts = list(tmp)
    return Response({'success':True, 'posts' : posts}, status = HTTP_200_OK)

@api_view(["POST"])
def saveTasteInfo(request):
    saveTasteSerializer = SaveTasteSerializer(data=request.data)
    if not saveTasteSerializer.is_valid():
        return Response({'success':False, 'err':saveTasteSerializer.errors}, status=HTTP_400_BAD_REQUEST)
    
    postList = saveTasteSerializer.validated_data['postList']
    postData = []
    for post in postList:
        postId = post['postId']
        try:
            postObj = Post.objects.get(id=postId)
        except:
            return Response({'success' : False}, status = HTTP_500_INTERNAL_SERVER_ERROR)
        title = postObj.title
        thumbnail = postObj.thumbnail.url
        userId = postObj.user
        postDict = {
            'title' : title,
            'thumbnail' : thumbnail,
            'userId' : userId,
        }
        postData.append(postDict)

    try:
        taste = saveTasteSerializer.create(saveTasteSerializer.validated_data)
    except APIException as e:
        return Response({'success' : False, 'err' : e.detail}, status = HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'success' : True, 'postList' : postData}, status = HTTP_201_CREATED})