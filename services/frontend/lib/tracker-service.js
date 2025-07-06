const API_BASE_URL = "http://gradpilot.me:8083";

export const trackerService = {
  // Save a task (university, professor, or scholarship)
  async saveTask(type, taskId) {
    try {
      const token = localStorage.getItem('token');
      console.log("TOKEN", token)
      console.log('Tracker service - token:', token ? 'present' : 'missing');
      console.log('Tracker service - API URL:', API_BASE_URL);
      console.log('Tracker service - type:', type, 'taskId:', taskId);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const requestBody = {
        type: type,
        taskId: taskId
      };
      console.log('Tracker service - request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/api/recommendations/tracker/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Tracker service - response status:', response.status);
      console.log('Tracker service - response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Tracker service - error data:', errorData);
        throw new Error(errorData.error || 'Failed to save task');
      }

      const data = await response.json();
      console.log('Tracker service - success data:', data);
      return data;
    } catch (error) {
      console.error('Error saving task:', error);
      throw error;
    }
  },

  // Get all tasks for the current user
  async getUserTasks() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/tracker/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get tasks by type (university, professor, or scholarship)
  async getUserTasksByType(type) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/tracker/tasks/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tasks by type:', error);
      throw error;
    }
  },

  // Remove a task
  async removeTask(type, taskId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/tracker/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: type,
          taskId: taskId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove task');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing task:', error);
      throw error;
    }
  },

  // Check if an item is saved
  async isItemSaved(type, taskId) {
    try {
      const tasks = await this.getUserTasksByType(type);
      return tasks.some(task => {
        // Get the appropriate ID based on task type
        let savedTaskId;
        switch (type) {
          case 'university':
            savedTaskId = task.universityId;
            break;
          case 'professor':
            savedTaskId = task.professorId;
            break;
          case 'scholarship':
            savedTaskId = task.scholarshipId;
            break;
          default:
            savedTaskId = task.taskId;
        }
        return savedTaskId && savedTaskId.toString() === taskId.toString();
      });
    } catch (error) {
      console.error('Error checking if item is saved:', error);
      return false;
    }
  }
}; 