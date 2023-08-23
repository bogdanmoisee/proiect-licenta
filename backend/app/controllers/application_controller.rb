# frozen_string_literal: true

class ApplicationController < ActionController::Base
  def render_response(response, status: 200)
    respond_to do |format|
      format.json { render json: response.to_json, status: status }
      format.html { render json: response.to_json, status: status }
    end
  end
end
