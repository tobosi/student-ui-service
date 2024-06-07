package za.co.dsignweb.studentmanager.ui.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppConfig {

    @Value("${config.student-manager}")
    private String ws;

    @GetMapping("/config")
    public Configs getWsUrl() {
        return new Configs(ws);
    }
}
