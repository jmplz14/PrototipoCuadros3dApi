# Generated by Django 3.2.8 on 2021-11-04 11:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('visualizador3D', '0002_auto_20211103_1717'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tipo',
            name='description',
        ),
        migrations.RemoveField(
            model_name='tipo',
            name='nombre',
        ),
    ]