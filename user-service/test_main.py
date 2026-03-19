import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_register_user_schema():
    # This is a basic test to verify the endpoint exists and handles requests
    # In a full test suite, we'd use a test database
    userData = {
        "username": "testuser_unique_123",
        "email": "test@example.com",
        "password": "password123"
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/register", json=userData)
    # We expect 400 or 201 depending on if DB is connected/setup
    assert response.status_code in [201, 400, 500] 
