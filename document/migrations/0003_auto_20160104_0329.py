# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-04 09:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0002_auto_20151230_1732'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='comment_version',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='document',
            name='comments',
            field=models.TextField(default=b'[]'),
        ),
    ]
