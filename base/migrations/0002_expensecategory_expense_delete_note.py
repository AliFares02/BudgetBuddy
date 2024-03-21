# Generated by Django 5.0.2 on 2024-03-20 21:57

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ExpenseCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('food', 'Food'), ('transportation', 'Transportation'), ('housing', 'Housing'), ('utilities', 'Utilities'), ('entertainment', 'Entertainment'), ('education', 'Education'), ('medical', 'Medical'), ('others', 'Others')], max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expense', models.DecimalField(decimal_places=2, max_digits=10)),
                ('expense_date', models.DateField(default=datetime.date.today)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('expense_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.expensecategory')),
            ],
        ),
        migrations.DeleteModel(
            name='Note',
        ),
    ]
