# Generated by Django 3.2 on 2023-02-26 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0002_item_merchant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='on_stock',
            field=models.CharField(default='Available', max_length=13),
        ),
    ]