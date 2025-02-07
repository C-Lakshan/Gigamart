package com.comrepublic.shopx;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Duration;

public class ShopxApplicationTests {

    private WebDriver driver;

    @BeforeEach
    public void setup() {
        // Setup ChromeDriver automatically
        WebDriverManager.chromedriver().setup();
        // Chrome options
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        // Setup path manually for chrome.exe
        options.setBinary("C:\\Users\\Vihanga\\Downloads\\chrome-win64 133\\chrome-win64\\chrome.exe");
        // Initialize the ChromeDriver
        driver = new ChromeDriver(options);
    }

    @Test
    public void testPayment() {
        int loadTime = 2500;

        // Navigation to the First page
        driver.get("http://localhost:3000/");
        // Waiting time (1000 ms) for load home page
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Navigation to the login page
        driver.get("http://localhost:3000/v1/login");
        // Waiting time (1000 ms) for load login page
        try {
            Thread.sleep(1000); 
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // Find the web component (Username field) by classname
        WebElement usernameField = driver.findElement(By.name("userName"));
        // Send keys (Username)
        usernameField.sendKeys("vihangan20@gmail.com");
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component (Password field) by classname
        WebElement passwordField = driver.findElement(By.name("password"));
        passwordField.sendKeys("200000");
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component ("Sign In" button) using text content
        WebElement signInButton = driver.findElement(By.xpath("//button[text()='Sign In']"));
        // Click button
        signInButton.click();

        // Verification
        assertEquals("vihangan20@gmail.com", usernameField.getAttribute("value"), "Username mismatch!");
        assertEquals("200000", passwordField.getAttribute("value"), "Password mismatch!");
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        

    }
}
