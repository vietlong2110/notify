from mongoengine import *

connect(db='notify')


class Sources(Document):
    _id = StringField(required=True)
    source = StringField(required=True)
    lang = StringField(required=True)
    links = ListField(StringField())
    meta = {'strict': False}

class Articles(Document):
    link = StringField(required=True)
    title = StringField(required=True)
    description = StringField(required=True)
    image = StringField(required=True)
    tags = ListField()
    content = StringField(required=True)
    source = StringField(required=True)
    videos = ListField()
    lang = StringField()
    publishedDate = StringField(required=True)
    meta = {'strict': False}


for obj in Articles.objects:
    print(obj.title)

print(len(Articles.objects))