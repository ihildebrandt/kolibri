# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-05-10 23:17
from __future__ import unicode_literals

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logger', '0010_auto_20170509_2255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attemptlog',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kolibriauth.FacilityUser'),
        ),
        migrations.AlterField(
            model_name='examattemptlog',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kolibriauth.FacilityUser'),
        ),
    ]
