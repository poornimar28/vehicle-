package com.AutoServix.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.AutoServix.models.Vendor;
import com.AutoServix.repository.VendorRepository;

import org.springframework.stereotype.Service;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepo;

    public List<Vendor> GetallServices() {
        return vendorRepo.findAll();
    }

    public List<Vendor> Getalluser(Integer Customer_Id){
        return vendorRepo.findByCustomerId(Customer_Id);
    }
    public List<Vendor> getServiceById(Integer Service_Id){
        return vendorRepo.findByServiceid(Service_Id);
    }

    public List<Vendor> Getallmechicalids (Integer Mechanical_Id){
        return vendorRepo.findByMechanicMechId(Mechanical_Id);
    }

    public List<Vendor> getAllServices() {

        return vendorRepo.findAll();
    }

    public List<Vendor> getByCustomerId(Integer id) {
        return vendorRepo.findByCustomerId(id);
    }

    public List<Vendor> getByServiceId(Integer id) {
        return vendorRepo.findByServiceid(id);
    }

    public  List<Vendor> getByMechanicId( Integer id) {
        return vendorRepo.findByMechanicMechId(id);
    }
}