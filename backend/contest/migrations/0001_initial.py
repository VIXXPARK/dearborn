# Generated by Django 3.1 on 2020-10-13 05:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(default=None)),
                ('updated_dt', models.DateTimeField(auto_now_add=True)),
                ('contest_expire', models.DateTimeField()),
                ('image', models.ImageField(upload_to='event/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ContestPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(default=None)),
                ('updated_dt', models.DateTimeField(auto_now_add=True)),
                ('expire_dt', models.DateTimeField()),
                ('thumbnail', models.ImageField(upload_to='contestPost/')),
                ('contest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contest.contest')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ContestPostImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='contestImages/')),
                ('contestPost', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contest.contestpost')),
            ],
        ),
    ]
