# Generated by Django 3.0.8 on 2020-10-14 10:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('post', '0001_initial'),
        ('bid', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bidinfo',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.Post'),
        ),
    ]
