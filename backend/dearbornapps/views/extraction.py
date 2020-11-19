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
from dearbornapps.models.post import Post, PostImage
from dearbornapps.models.extraction import Taste
from dearbornapps.models.user import User
from dearbornapps.serializers.extraction import CategorySerializer, FilterSerializer, SaveTasteSerializer, RecommendPostSerializer
from dearbornapps.feature.feature import Similarity, GetFeatureVector, GetImageArray

@api_view(["POST"])
def getCategory(request):
    catSerializer = CategorySerializer(data=request.data)
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
        image_array, image_file_name, image_id = GetImageArray(post)
        vectors = GetFeatureVector(image_array)
        similarities = Similarity(vectors, 5)
        for sim in similarities:
            similarity = sim['similarity']
            if similarity >= 0.7:
                posts.append(sim['postId'])
    tmp = set(posts)
    posts = list(tmp)
    context = []
    for post in posts:
        try:
            thumbnail = Post.objects.get(id = post).thumbnail.url
        except:
            thumbnail = None
        postData = {
            'postId' : post,
            'thumbnail' : thumbnail,
        }
        context.append(postData)
    return Response({'success':True, 'posts' : context}, status = HTTP_200_OK)

@api_view(["POST"])
def saveTasteInfo(request):
    saveTasteSerializer = SaveTasteSerializer(data=request.data)
    if not saveTasteSerializer.is_valid():
        return Response({'success':False, 'err':saveTasteSerializer.errors}, status=HTTP_400_BAD_REQUEST)
    
    postList = saveTasteSerializer.validated_data['postList']
    postData = []
    for post in postList:
        postId = post['postId']
        userId = post['userId']
        try:
            postObj = Post.objects.get(id=postId)
            user = User.object.get(id = userId)
        except:
            return Response({'success' : False}, status = HTTP_500_INTERNAL_SERVER_ERROR)
        title = postObj.title
        thumbnail = postObj.thumbnail.url
        try:
            taste = Taste(user=user,post=postObj)
            taste.save()
        except e:
            return Response({'success' : False, 'err' : e.detail}, status = HTTP_500_INTERNAL_SERVER_ERROR)
        postDict = {
            'title' : title,
            'thumbnail' : thumbnail,
            'postId' : postId,
            'userId' : userId,
        }
        postData.append(postDict)

    return Response({'success' : True, 'postList' : postData}, status = HTTP_201_CREATED)

@api_view(["POST"])
def recommend(request):
    recommandSerializer = RecommendPostSerializer(data=request.data)
    if not recommandSerializer.is_valid():
        return Response({'success':False, 'err':recommandSerializer.errors}, status=HTTP_400_BAD_REQUEST)
    
    postId = recommandSerializer.validated_data['postId']
    image_array, image_file_name, image_id = GetImageArray(postId)
    vectors = GetFeatureVector(image_array)
    similarities = Similarity(vectors, 8)
    postData = []
    print(similarities)
    for sim in similarities:
        similarity = sim['similarity']
        postid = sim['postId']
        if similarity >= 0.8:
            if postId != postid:
                print("postId = ", postId)
                print("postid = ", postid)
                try:
                    post = Post.objects.get(id=postid)
                    user = post.user
                except:
                    return  Response({'success':False}, status=HTTP_500_INTERNAL_SERVER_ERROR)

                try:
                    thumb = post.thumbnail.url
                except:
                    thumb = None

                try:
                    nick = user.nickname
                except:
                    nick = None

                try:
                    profile = user.profileImage.url
                except:
                    profile = None
                postDic = {
                    'id' : post.id,
                    'title' : post.title,
                    'content' : post.content,
                    'updated_dt' : post.updated_dt,
                    'userId' : user.id,
                    'thumbnail' : thumb,
                    'writer' : nick,
                    'profileImage' : profile,
                    'view':post.view,
                    'score':post.score,
                }
                postData.append(postDic)
    
    return Response({'success' : True, 'posts' : postData}, status=HTTP_200_OK)