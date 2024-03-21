# Generated by Django 5.0.2 on 2024-03-20 22:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_rename_name_expensecategory_categories'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expense',
            name='expense_category',
        ),
        migrations.AddField(
            model_name='expensecategory',
            name='expense',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='base.expense'),
        ),
    ]