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

        // Find the web component ('Laptop' link) by using XPath
        // WebElement laptopLink = driver.findElement(By.xpath("//a[@href='/Laptop']"));
        // Click link
        // laptopLink.click();

        // Find the web component ('Desktop' link) by using XPath
        WebElement DesktopLink = driver.findElement(By.xpath("//a[@href='/Desktop']"));
        // Click link
        DesktopLink.click();
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Verification
        assertTrue(driver.getCurrentUrl().contains("Desktop"), "User should be on the Desktop page");
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component ('Apple Mac Studio' product image link) by using XPath & href
        WebElement productImageLink = driver.findElement(By.xpath("//a[@href='/product/apple-mac-studio']"));
        productImageLink.click();
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component (Button inside a div with the text of "Add to cart") by using XPath
        WebElement addToCartButton = driver.findElement(By.xpath("//button[.//div[contains(text(), 'Add to cart')]]"));
        addToCartButton.click();
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component (cart icon link) by using XPath & href
        WebElement cartIcon = driver.findElement(By.xpath("//a[@href='/cart-items']"));
        cartIcon.click();
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Verification
        assertTrue(driver.getCurrentUrl().contains("cart-items"), "User should be redirected to the cart page.");
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component ("Checkout" button) using xpath & text content
        WebElement checkout = driver.findElement(By.xpath("//button[text()='Checkout']"));
        checkout.click();
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component (radio button for "Credit/Debit Card") using xpath & input type
        WebElement cardRadioButton = driver.findElement(By.xpath("//input[@type='radio' and @value='CARD']"));
        cardRadioButton.click();
        try {
            Thread.sleep(loadTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Verification
        assertTrue(cardRadioButton.isSelected(), "The Credit/Debit Card option should be selected.");
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component ("elements-inner-payment" iframe) using xpath & src attribute
        WebElement iframe = driver.findElement(By.xpath("//iframe[contains(@src, 'elements-inner-payment')]"));
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Switch to the iframe 
        driver.switchTo().frame(iframe);
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component (card number input field) using xpath & placeholder
        WebElement cardNumberInput = driver.findElement(By.xpath("//input[@placeholder='1234 1234 1234 1234']"));
        cardNumberInput.sendKeys("4242424242424242");
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component (expiry month input field) using xpath & placeholder
        WebElement expiryDateInput = driver.findElement(By.xpath("//input[@placeholder='MM / YY']"));
        expiryDateInput.sendKeys("12/25");
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Find the web component (cvc field) using xpath & placeholder
        WebElement cvcInput = driver.findElement(By.xpath("//input[@placeholder='CVC']"));
        cvcInput.sendKeys("123");
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Switch to the default 
        driver.switchTo().defaultContent();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Find the web component ("Pay Now" button) using xpath & text content
        WebElement payNowButton = driver.findElement(By.xpath("//button[text()='Pay Now']"));
        payNowButton.click();
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        

    }
}
