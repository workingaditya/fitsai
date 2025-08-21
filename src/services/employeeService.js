// Demo employee service

class EmployeeService {
  async getEmployees(filters = {}) {
    return [
      {
        id: 'emp-1',
        name: 'Admin User',
        email: 'admin@company.com',
        department: 'IT',
        role: 'admin',
        status: 'active'
      },
      {
        id: 'emp-2',
        name: 'Employee User',
        email: 'employee@company.com',
        department: 'Operations',
        role: 'viewer',
        status: 'active'
      }
    ];
  }

  async getEmployeeById(employeeId) {
    const employees = await this.getEmployees();
    return employees.find(emp => emp.id === employeeId) || null;
  }

  async createEmployee(employeeData) {
    throw new Error('Employee creation not available in demo mode');
  }

  async updateEmployee(employeeId, updateData) {
    throw new Error('Employee updates not available in demo mode');
  }

  async deleteEmployee(employeeId) {
    throw new Error('Employee deletion not available in demo mode');
  }
}

export const employeeService = new EmployeeService();
export default employeeService;