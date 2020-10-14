<<<<<<< HEAD
# Generated by Django 3.1 on 2020-10-05 11:59
=======
# Generated by Django 3.1 on 2020-10-13 05:55
>>>>>>> 23c59bc8dcbabca84ecc23cc277c13995ce8d80d

import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.manager
import django.utils.timezone
import usermanagement.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.CharField(db_index=True, default=usermanagement.models.User.make_uuid, editable=False, max_length=36, primary_key=True, serialize=False, unique=True)),
                ('nickname', models.CharField(max_length=50, unique=True)),
                ('profileImage', models.ImageField(blank=True, upload_to='profileImage/')),
                ('job', models.IntegerField()),
                ('major', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('content', models.TextField(max_length=1000)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'ordering': ['nickname'],
            },
            managers=[
                ('object', django.db.models.manager.Manager()),
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
