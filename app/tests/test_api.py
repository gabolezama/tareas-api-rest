import json
import tornado.testing
from datetime import datetime, timezone
import pytest
import copy

from app.domain.models import Task
from app.presentation.dtos import TaskCreateDTO, TaskUpdateDTO, TaskResponseDTO
from app.tests.conftest import BaseAPITest

class TestTaskListHandler(BaseAPITest):
    """
    Tests para el TaskListHandler (rutas /tasks).
    """
    @tornado.testing.gen_test
    async def test_post_task_validation_error(self):
        """
        Verifies that POST /tasks returns 400 in case of validation error.
        """
        invalid_task_data = {
            "title": "a", # Too short
            "priority": 5 # Out of range
        }

        response = await self.http_client.fetch(
            self.get_url("/tasks"),
            method="POST",
            body=json.dumps(invalid_task_data),
            headers={"Content-Type": "application/json"},
            raise_error=False 
        )
        assert response.code == 400
        response_data = json.loads(response.body)
        assert "error" in response_data
        assert "Validation Error" in response_data["error"]
        
        self.mock_task_use_cases.create_task.assert_not_called()


    @tornado.testing.gen_test
    async def test_post_task_invalid_json(self):
        """
        Verifies that POST /tasks returns 400 if the JSON is invalid.
        """
        invalid_json_body = "{'title': 'Test', 'priority': 1" # Malformed JSON

        response = await self.http_client.fetch(
            self.get_url("/tasks"),
            method="POST",
            body=invalid_json_body,
            headers={"Content-Type": "application/json"},
            raise_error=False
        )
        assert response.code == 400
        response_data = json.loads(response.body)
        assert "error" in response_data
        assert "Invalid JSON" in response_data["error"]
        # No se llama al use case si el JSON es inválido
        self.mock_task_use_cases.create_task.assert_not_called()


class TestTaskDetailHandler(BaseAPITest):
    """
    Tests for the TaskDetailHandler (routes /tasks/{id}).
    """

    @tornado.testing.gen_test
    async def test_put_task_validation_error(self):
        """
        Verifies that PUT /tasks/{id} returns 400 in case of validation error.
        """
        invalid_update_data = {
            "title": "", # Too short
            "priority": 0 # Out of range
        }

        response = await self.http_client.fetch(
            self.get_url(f"/tasks/{self.sample_task.id}"),
            method="PUT",
            body=json.dumps(invalid_update_data),
            headers={"Content-Type": "application/json"},
            raise_error=False
        )
        assert response.code == 400
        response_data = json.loads(response.body)
        assert "error" in response_data
        assert "Validation Error" in response_data["error"]
        self.mock_task_use_cases.update_task.assert_not_called()

    @tornado.testing.gen_test
    async def test_options_requests(self):
        """
        Verifies that OPTIONS requests respond with 204 and CORS headers.
        """
        # Test for TaskListHandler
        response = await self.http_client.fetch(
            self.get_url("/tasks"),
            method="OPTIONS"
        )
        assert response.code == 204
        assert "Access-Control-Allow-Origin" in response.headers
        assert "Access-Control-Allow-Methods" in response.headers
        assert "Access-Control-Allow-Headers" in response.headers
        assert "Access-Control-Allow-Credentials" in response.headers

        # Test for TaskDetailHandler
        response = await self.http_client.fetch(
            self.get_url("/tasks/1"),
            method="OPTIONS"
        )
        assert response.code == 204
        assert "Access-Control-Allow-Origin" in response.headers
        assert "Access-Control-Allow-Methods" in response.headers
        assert "Access-Control-Allow-Headers" in response.headers
        assert "Access-Control-Allow-Credentials" in response.headers

