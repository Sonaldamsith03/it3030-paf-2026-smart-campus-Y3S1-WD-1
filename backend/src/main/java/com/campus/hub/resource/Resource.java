package com.campus.hub.resource;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String name;
    private String type; // ROOM | LAB | EQUIPMENT
    private String faculty;
    private String building;
    private int capacity;
    private String location;
    private String status; // ACTIVE | OUT_OF_SERVICE | MAINTENANCE
    private String description;

    public Resource() {}

    public Resource(String id, String name, String type, int capacity, String location, String status, String faculty, String building, String description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.status = status;
        this.faculty = faculty;
        this.building = building;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
