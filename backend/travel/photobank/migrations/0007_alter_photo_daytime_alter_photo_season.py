# Generated by Django 5.0.3 on 2024-04-07 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photobank', '0006_alter_photo_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='daytime',
            field=models.CharField(choices=[('ночь', 'Night'), ('утро', 'Morning'), ('день', 'Day'), ('вечер', 'Evening')], max_length=16, null=True),
        ),
        migrations.AlterField(
            model_name='photo',
            name='season',
            field=models.CharField(choices=[('зима', 'Winter'), ('весна', 'Spring'), ('лето', 'Summer'), ('осень', 'Fall')], max_length=16, null=True),
        ),
    ]
