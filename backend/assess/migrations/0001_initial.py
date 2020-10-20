# Generated by Django 3.0.8 on 2020-10-17 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('design', models.FloatField(default=0)),
                ('color', models.FloatField(default=0)),
                ('individuality', models.FloatField(default=0)),
                ('practicality', models.FloatField(default=0)),
                ('trend', models.FloatField(default=0)),
            ],
        ),
    ]
