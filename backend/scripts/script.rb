require 'net/http'
require 'uri'
require 'json'
require 'fileutils' # Include FileUtils

exercises = Exercise.all

exercises.each do |exercise|
  gif_url = 'https://firebasestorage.googleapis.com/v0/b/licenta-8c974.appspot.com/o/exercises%2Fexercise' + exercise.id.to_s + '.gif?alt=media'
  exercise.update(gif_url: gif_url)
end
