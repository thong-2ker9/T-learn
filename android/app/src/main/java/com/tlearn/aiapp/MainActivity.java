package com.tlearn.aiapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.content.Intent;
import android.provider.Settings;
import android.app.AlarmManager;
import android.content.Context;
import androidx.core.app.NotificationManagerCompat;
import android.Manifest;
import androidx.core.content.ContextCompat;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import com.capacitorjs.plugins.localnotifications.LocalNotificationsPlugin;

public class MainActivity extends BridgeActivity {
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1001;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Initializes the Bridge
        registerPlugin(LocalNotificationsPlugin.class);

        // Request necessary permissions
        requestPermissions();
        
        // Create notification channels
        createNotificationChannels();
        
        // Check for exact alarm permissions on Android 12+
        checkExactAlarmPermissions();
    }
    
    private void requestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) 
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, 
                    new String[]{Manifest.permission.POST_NOTIFICATIONS}, 
                    NOTIFICATION_PERMISSION_REQUEST);
            }
        }
    }
    
    private void checkExactAlarmPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null && !alarmManager.canScheduleExactAlarms()) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                if (intent.resolveActivity(getPackageManager()) != null) {
                    startActivity(intent);
                }
            }
        }
    }
    
    private void createAlarmSoundChannel(NotificationManager notificationManager, String channelId, String name, String resPath) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                channelId,
                name,
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            Uri soundUri = Uri.parse("android.resource://" + getPackageName() + resPath);
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build();
            channel.setSound(soundUri, audioAttributes);
            notificationManager.createNotificationChannel(channel);
        }
    }
    
    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager == null) return;
            
            // Per-sound channels so selected tone is respected on Android 8+
            createAlarmSoundChannel(notificationManager, "alarm_alarm327234", "Chuông mặc định", "/raw/alarm327234");
            createAlarmSoundChannel(notificationManager, "alarm_alarm301729", "Nhẹ nhàng", "/raw/alarm301729");
            createAlarmSoundChannel(notificationManager, "alarm_clockalarm8761", "Năng động", "/raw/clockalarm8761");
            createAlarmSoundChannel(notificationManager, "alarm_notification18270129", "Thiên nhiên", "/raw/notification18270129");
            
            // Default channel kept for backward compatibility
            String alarmChannelId = "alarm_channel";
            String alarmChannelName = "Alarm (Mặc định)";
            String alarmDescription = "Thông báo báo thức mặc định";
            
            NotificationChannel alarmChannel = new NotificationChannel(
                alarmChannelId,
                alarmChannelName,
                NotificationManager.IMPORTANCE_HIGH
            );
            
            alarmChannel.setDescription(alarmDescription);
            alarmChannel.enableVibration(true);
            alarmChannel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            alarmChannel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            
            notificationManager.createNotificationChannel(alarmChannel);
            
            // Timer channel
            String timerChannelId = "timer_channel";
            String timerChannelName = "Timer Notifications";
            String timerDescription = "Thông báo hẹn giờ";
            
            NotificationChannel timerChannel = new NotificationChannel(
                timerChannelId,
                timerChannelName,
                NotificationManager.IMPORTANCE_HIGH
            );
            
            timerChannel.setDescription(timerDescription);
            timerChannel.enableVibration(true);
            timerChannel.setVibrationPattern(new long[]{0, 500, 250, 500});
            timerChannel.enableLights(true);
            timerChannel.setLightColor(android.graphics.Color.BLUE);
            
            Uri timerSoundUri = Uri.parse("android.resource://" + getPackageName() + "/raw/alarm301729");
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build();
            timerChannel.setSound(timerSoundUri, audioAttributes);
            
            notificationManager.createNotificationChannel(timerChannel);
            
            // General notifications channel
            String generalChannelId = "general_channel";
            String generalChannelName = "General Notifications";
            String generalDescription = "Thông báo chung của ứng dụng";
            
            NotificationChannel generalChannel = new NotificationChannel(
                generalChannelId,
                generalChannelName,
                NotificationManager.IMPORTANCE_DEFAULT
            );
            
            generalChannel.setDescription(generalDescription);
            generalChannel.enableVibration(true);
            
            notificationManager.createNotificationChannel(generalChannel);
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted - recreate channels to ensure proper setup
                createNotificationChannels();
            } else {
                // Permission denied - you might want to show an explanation
                // or direct user to settings
            }
        }
    }
}
