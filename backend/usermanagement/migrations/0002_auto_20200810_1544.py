# Generated by Django 3.1 on 2020-08-10 06:44

from django.db import migrations, models
import usermanagement.models


class Migration(migrations.Migration):

    dependencies = [
        ('usermanagement', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.CharField(db_index=True, default=usermanagement.models.User.make_uuid, editable=False, max_length=36, primary_key=True, serialize=False, unique=True),
        ),
    ]
