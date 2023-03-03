package com.scheduler.controller;

import com.scheduler.service.DiaryService;
import com.scheduler.service.model.DiaryDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduler/diary")
@AllArgsConstructor
public class DiaryController {
    private final DiaryService diaryService;

    @GetMapping

    public ResponseEntity<List<DiaryDto>> getAllDiaries(@RequestParam(required = true) String token){

        return new ResponseEntity<>(diaryService.allUserDiaries(token), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")

    @PostMapping

    public ResponseEntity<List<DiaryDto>> createDiary(@RequestParam(required = true) String token, @RequestBody DiaryDto dto){

        return new ResponseEntity<>(diaryService.saveDiary(token, dto), HttpStatus.OK);
    }


    @CrossOrigin(origins = "http://localhost:4200")

    @DeleteMapping(value = "/{id}")

    public ResponseEntity<List<DiaryDto>> deleteDiary(@PathVariable(required = true) String id, @RequestParam(required = true) String token){
        return new ResponseEntity<>(diaryService.deleteDiary(id, token), HttpStatus.OK);
    }

    @GetMapping("/{id}")

    public ResponseEntity<DiaryDto> getDiaryById(@PathVariable(required = true) String id, @RequestParam(required = true) String token){

        return new ResponseEntity<>(diaryService.getDiaryById(id, token), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")

    @PutMapping("/{id}")

    public ResponseEntity<List<DiaryDto>> updateDiary(@PathVariable(required = true) String id, @RequestBody DiaryDto dto, @RequestParam(required = true) String token){

        return new ResponseEntity<>(diaryService.updateDiary(dto, token), HttpStatus.OK);
    }


}
