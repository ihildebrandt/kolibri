# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-03-27 09:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0008_auto_20170311_0015'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exam',
            old_name='deleted',
            new_name='archive',
        ),
        migrations.AddField(
            model_name='exam',
            name='channel_id',
            field=models.CharField(default='78eed5c0b59b30c0a40c94c17c849af6', max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='exam',
            name='seed',
            field=models.IntegerField(default=1),
        ),
    ]
