class RemoveSetsAndRepsFromExercises < ActiveRecord::Migration[7.0]
  def change
    remove_column :exercises, :sets, :integer
    remove_column :exercises, :reps, :integer
  end
end
