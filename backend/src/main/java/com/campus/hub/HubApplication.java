package com.campus.hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class HubApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("..")
				.filename(".env")
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		// Validation Check for Environment Variables
		String mongoUri = System.getProperty("MONGODB_URI");
		if (mongoUri == null || mongoUri.isEmpty()) {
			System.err.println("\n\u001B[31m################################################################");
			System.err.println("CRITICAL ERROR: Environment variables are missing!");
			System.err.println("Please create a '.env' file in the root directory (parent of 'backend').");
			System.err.println("You can use '.env.example' as a template.");
			System.err.println("################################################################\u001B[0m\n");
			
			// We don't exit here because we provided a fallback in application.properties,
			// but this warning will help new users identify why the app might fail later.
		}

		SpringApplication.run(HubApplication.class, args);
	}

}
