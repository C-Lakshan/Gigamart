package com.comrepublic.shopx.auth.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comrepublic.shopx.auth.config.JWTTokenHelper;
import com.comrepublic.shopx.auth.entities.User;
import com.comrepublic.shopx.auth.services.OAuth2Service;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping("/oauth2")
public class OAuth2Controller {

    @Autowired
    OAuth2Service oAuth2Service;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private JWTTokenHelper jwtTokenHelper;

    @GetMapping("/success")
    public void callbackOAuth2(@AuthenticationPrincipal OAuth2User oAuth2User, HttpServletResponse response) throws IOException {

        String userName = oAuth2User.getAttribute("email");
        User user=oAuth2Service.getUser(userName);
        if(null == user){
            user = oAuth2Service.createUser(oAuth2User,"google");
        }

        String token = jwtTokenHelper.generateToken(user.getUsername());

        // response.sendRedirect("http://localhost:3000/oauth2/callback?token="+token);
        response.sendRedirect(frontendUrl + "/oauth2/callback?token=" + token);

    }
}
