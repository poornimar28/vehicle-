package com.AutoServix.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AutoServix.models.Vendor;
import com.AutoServix.service.VendorService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequestMapping("/vendor")
@RestController

public class VendorController {
    @Autowired
    private VendorService vendorService;

    @GetMapping("/getall")
    public List<Vendor> Getallservice(){
        return vendorService.getAllServices();

    }
    @GetMapping("/customer/{id}")
    public List<Vendor> GetCustomerid(@PathVariable Integer id){
        return vendorService.getByCustomerId(id);
    }


    @GetMapping("/service/{id}")
    public List<Vendor> GetServiceid(@PathVariable Integer id){
        return vendorService.getByServiceId(id);
    }
    @GetMapping("/mechanic/{id}")
    public List<Vendor> Getmechanicalid(@PathVariable Integer id){
        return vendorService.getByMechanicId(id);
    }
}