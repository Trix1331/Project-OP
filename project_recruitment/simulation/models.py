from django.db import models

class Question(models.Model):
    text = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.text

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    next_question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True, blank=True, related_name='previous_options')
    score = models.IntegerField(default=0)
    
    def __str__(self):
        return self.text