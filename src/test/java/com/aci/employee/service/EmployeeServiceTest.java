package com.aci.employee.service;

import com.aci.employee.model.Employee;
import com.aci.employee.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void shouldCreateEmployee() {
        Employee employee = new Employee("Arnold", "DevOps", "arnold@example.com");
        when(employeeRepository.existsByEmail(employee.getEmail())).thenReturn(false);
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = employeeService.createEmployee(employee);

        assertEquals("Arnold", result.getName());
        verify(employeeRepository).save(employee);
    }

    @Test
    void shouldRejectDuplicateEmail() {
        Employee employee = new Employee("Arnold", "DevOps", "arnold@example.com");
        when(employeeRepository.existsByEmail(employee.getEmail())).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> employeeService.createEmployee(employee));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void shouldReturnEmployeeById() {
        Employee employee = new Employee("Arnold", "DevOps", "arnold@example.com");
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertEquals("Arnold", employeeService.getEmployeeById(1L).getName());
    }
}
