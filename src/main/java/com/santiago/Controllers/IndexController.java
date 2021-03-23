package com.santiago.Controllers;

import java.io.IOException;
import java.net.URI;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.santiago.AzureBlobAdapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/")
public class IndexController {
    
    @Autowired
    private AzureBlobAdapter azureBlobAdapter;

    @Value("${azure.storage.container.name}")
    private String conection;

    @GetMapping("")
    public String index(Model model) {
        model.addAttribute("ambiente", conection.equals("containerimgs") ? "Ambiente Produccion" : "Ambiente Pruebas") ;
        return "home";
    }

    @PostMapping("/uploadimg")
    public ResponseEntity upload(MultipartFile file){
        URI url = azureBlobAdapter.upload(file);
        return ResponseEntity.ok(url);
    }   

    @GetMapping("/blobs")
    public ResponseEntity getAllBlobs(){
        List<String> uris = azureBlobAdapter.listBlobs(conection);
        return ResponseEntity.ok(uris);
    }

    @GetMapping("/receiveName")
    public void getImage(@RequestParam String namePhoto,HttpServletResponse response) throws IOException{
        azureBlobAdapter.getImage(conection, namePhoto, response.getOutputStream());
    }

    @DeleteMapping("/deleteBlob")
    public ResponseEntity delete(@RequestParam String blobName){
        azureBlobAdapter.deleteBlob(conection, blobName);
        return ResponseEntity.ok().build();
    }



}