<<<<<<< HEAD
# Generated by Django 3.0.8 on 2020-10-27 06:02
=======
# Generated by Django 3.0.8 on 2020-10-28 05:43
>>>>>>> f92e4b81859464bb975267387d587588bee8b911

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
