package com.AutoServix.service;

import com.AutoServix.models.Customer;
import com.AutoServix.models.ServiceRecord;
import com.AutoServix.repository.CustomerRepository;
import com.AutoServix.repository.ServiceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceRecordService {

    @Autowired
    private ServiceRecordRepository serviceRecordRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<ServiceRecord> getCustomerServiceHistory(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return serviceRecordRepository.findByVehicleCustomerId(customer.getId());
    }

    public List<ServiceRecord> getAllAdminServiceHistory() {
        return serviceRecordRepository.findAll();
    }

    public ServiceRecord rateServiceRecord(Integer id, Integer rating) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service record not found"));
        record.setRating(rating);
        return serviceRecordRepository.save(record);
    }
}
