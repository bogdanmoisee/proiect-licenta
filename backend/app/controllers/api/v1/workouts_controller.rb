class Api::V1::WorkoutsController < ApiController
  before_action :set_workout, only: %i[show edit update destroy]
  protect_from_forgery with: :null_session
  before_action :doorkeeper_authorize!, only: %i[user_workouts]
  before_action :current_user, only: %i[user_workouts]

  # GET /workouts or /workouts.json
  def index
    @workouts = Workout.all

    respond_to do |format|
      format.json { render json: @workouts }
    end
  end

  # GET /users/user_id/workouts
  def user_workouts
    user = User.find(params[:user_id])

    workouts_data = []
    workouts = user.workouts.includes(:exercises).order('workouts.updated_at DESC')
    workouts = workouts.where(parent_id: nil) unless user.id == @current_user.id
    workouts.each do |workout|
      is_parent = Workout.find_by(parent_id: workout.id, user_id: @current_user.id).present?
      workout_data = {
        id: workout.id,
        name: workout.name,
        exercises: [],
        is_parent: is_parent
      }
      exercises_data = []
      workout.exercises.each do |exercise|
        workout_exercise = exercise.workout_exercises.find_by(workout_id: workout.id)
        exercise_data = {
          id: exercise.id,
          name: exercise.name,
          sets: workout_exercise.sets || 0,
          reps: workout_exercise.reps || 0
        }
        exercises_data << exercise_data
      end
      workout_data[:exercises] = exercises_data
      workouts_data << workout_data
    end
    respond_to do |format|
      format.json { render json: workouts_data }
    end
  end

  # GET /users/user_id/following-workouts
  def user_following_workouts
    current_user = User.find(params[:user_id])

    start = params[:start].to_i
    limit = params[:limit].to_i || 5

    workouts = Workout.joins(user: :followers).where('relationships.follower_id = :id AND workouts.user_id != :id AND workouts.parent_id IS NULL',
                                                     { id: current_user.id }).order('workouts.updated_at DESC').offset(start).limit(limit)
    workouts_data = []
    workouts.each do |workout|
      user = workout.user
      is_parent = Workout.find_by(parent_id: workout.id, user_id: current_user.id).present?
      workout_data = {
        id: workout.id,
        name: workout.name,
        updated_at: workout.updated_at,
        exercises: [],
        is_parent: is_parent,
        user: {
          email: user.email,
          username: user.username,
          avatar_url: user.avatar_url
        }
      }
      exercises_data = []
      workout.exercises.each do |exercise|
        workout_exercise = exercise.workout_exercises.find_by(workout_id: workout.id)
        exercise_data = {
          id: exercise.id,
          name: exercise.name,
          sets: workout_exercise.sets || 0,
          reps: workout_exercise.reps || 0
        }
        exercises_data << exercise_data
      end
      workout_data[:exercises] = exercises_data
      workouts_data << workout_data
    end

    respond_to do |format|
      format.json { render json: workouts_data }
    end
  end

  # GET /workouts/1 or /workouts/1.json
  def show
    @workout = Workout.includes(:exercises).find(params[:id])

    workout_data = {
      id: @workout.id,
      name: @workout.name,
      exercises: []
    }
    exercises_data = []
    @workout.exercises.each do |exercise|
      workout_exercise = exercise.workout_exercises.find_by(workout_id: @workout.id)
      exercise_data = {
        id: exercise.id,
        name: exercise.name,
        sets: workout_exercise.sets || 0,
        reps: workout_exercise.reps || 0
      }
      exercises_data << exercise_data
    end

    workout_data[:exercises] = exercises_data

    respond_to do |format|
      format.json { render json: workout_data }
    end
  end

  # GET /workouts/new
  def new
    @workout = Workout.new
  end

  # GET /workouts/1/edit
  def edit; end

  # POST /workouts or /workouts.json
  def create
    ActiveRecord::Base.transaction do
      @workout = Workout.new(workout_params)

      if @workout.save
        params[:exercises].each do |exercise|
          exercise = exercise_params(exercise)
          WorkoutExercise.create!(workout_exercise_params(exercise))
        end
      end
    end

    respond_to do |format|
      if @workout.persisted?
        format.html { render json: @workout.to_json, status: :ok, notice: 'Workout was successfully created.' }
        format.json { render json: @workout.to_json, status: :ok }
      else
        format.html { render json: @workout.errors.to_json, status: :unprocessable_entity }
        format.json { render json: @workout.errors.to_json, status: :unprocessable_entity }
      end
    end
  end

  # POST /workouts/clone
  def clone
    parent_workout = Workout.find(params[:parent_id])

    @workout = parent_workout.dup
    @workout.user_id = params[:user_id]
    @workout.parent_id = params[:parent_id]

    respond_to do |format|
      if @workout.save
        parent_workout.workout_exercises.each do |workout_exercise|
          cloned_workout_exercise = workout_exercise.dup
          cloned_workout_exercise.workout_id = @workout.id
          cloned_workout_exercise.save
        end

        format.html { render json: @workout.to_json, status: :ok, notice: 'Workout was successfully cloned.' }
        format.json { render json: @workout.to_json, status: :ok }
      else
        format.html { render json: @workout.errors.to_json, status: :unprocessable_entity }
        format.json { render json: @workout.errors.to_json, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /workouts/1 or /workouts/1.json
  def update
    ActiveRecord::Base.transaction do
      @workout.update(workout_params)

      @workout.workout_exercises.destroy_all

      params[:exercises].each do |exercise|
        exercise = exercise_params(exercise)
        WorkoutExercise.create!(workout_exercise_params(exercise))
      end
    end

    respond_to do |format|
      format.html { render json: @workout.to_json, status: :ok, notice: 'Workout was successfully updated.' }
      format.json { render json: @workout.to_json, status: :ok }
    end
  end

  # DELETE /workouts/1 or /workouts/1.json
  def destroy
    workout_id = @workout.id
    @workout.destroy

    respond_to do |format|
      format.html { render json: workout_id.to_json, status: :ok, notice: "Workout #{workout_id} was successfully destroyed." }
      format.json { render json: workout_id.to_json, status: :ok }
    end
  end

  # DELETE /workouts/clone/id
  def destroy_clone
    workout = Workout.find_by(user_id: params[:user_id], parent_id: params[:id])
    workout_id = workout.id
    workout.destroy if workout

    respond_to do |format|
      format.html { render json: workout_id.to_json, status: :ok, notice: "Workout #{workout_id} was successfully destroyed." }
      format.json { render json: workout_id.to_json, status: :ok }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_workout
    @workout = Workout.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def workout_params
    params.require(:workout).permit(:name, :user_id, :parent_id)
  end

  def exercise_params(exercise)
    exercise.permit(:id, :name, :sets, :reps)
  end

  def workout_exercise_params(exercise)
    {
      workout_id: @workout.id,
      exercise_id: exercise[:id],
      sets: exercise[:sets],
      reps: exercise[:reps]
    }
  end
end
