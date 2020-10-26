# Generated by Django 3.0.8 on 2020-10-26 08:45

from django.db import migrations, models
import django.db.models.deletion
import post.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='disLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='myWork',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=500)),
                ('content', models.TextField()),
                ('updated_dt', models.DateTimeField(auto_now_add=True)),
                ('thumbnail', models.ImageField(null=True, upload_to=post.models.postUpload_to)),
                ('view', models.IntegerField(default=0)),
                ('scope', models.IntegerField(default=0)),
                ('sell', models.IntegerField(default=0)),
                ('category', models.IntegerField(default=None)),
                ('expire_dt', models.DateTimeField()),
                ('is_repo', models.BooleanField(default=False)),
                ('bidPrice', models.IntegerField()),
                ('sellPrice', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='PostImage',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to=post.models.postImageUpload_to)),
            ],
        ),
        migrations.CreateModel(
            name='vote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.Post')),
            ],
        ),
    ]
