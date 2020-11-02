# Generated by Django 3.0.8 on 2020-10-31 11:05

import contest.models
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(default=None)),
                ('updated_dt', models.DateTimeField(auto_now_add=True)),
                ('contest_expire', models.DateTimeField()),
                ('image', models.ImageField(upload_to=contest.models.contestUpload_to)),
                ('banner', models.ImageField(null=True, upload_to=contest.models.bannerUpload_to)),
            ],
        ),
    ]
