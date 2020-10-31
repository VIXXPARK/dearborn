# Generated by Django 3.0.8 on 2020-10-28 05:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('messanger', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='userFrom',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='From', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='message',
            name='userTo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='To', to=settings.AUTH_USER_MODEL),
        ),
    ]
