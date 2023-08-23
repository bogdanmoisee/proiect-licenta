class AddPositionToWorkoutExercise < ActiveRecord::Migration[7.0]
  def change
    add_column :workout_exercises, :position, :integer
  end
end
