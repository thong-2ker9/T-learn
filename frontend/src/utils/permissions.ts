import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class PermissionsManager {
  /**
   * Request notification permissions for Android 13+
   */
  static async requestNotificationPermissions(): Promise<boolean> {
    try {
      if (Capacitor.getPlatform() === 'web') {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
        return Notification.permission === 'granted';
      } else {
        // Mobile platform - use Capacitor
        const permission = await LocalNotifications.requestPermissions();
        console.log('Notification permission result:', permission);
        return permission.display === 'granted';
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notification permissions are granted
   */
  static async checkNotificationPermissions(): Promise<boolean> {
    try {
      if (Capacitor.getPlatform() === 'web') {
        return Notification.permission === 'granted';
      } else {
        const permission = await LocalNotifications.checkPermissions();
        return permission.display === 'granted';
      }
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Request exact alarm permissions for Android 12+
   * This is handled in MainActivity.java
   */
  static async requestExactAlarmPermissions(): Promise<void> {
    if (Capacitor.getPlatform() !== 'web') {
      // This is handled by MainActivity.java checkExactAlarmPermissions()
      console.log('Exact alarm permissions are handled by native Android code');
    }
  }

  /**
   * Show permissions explanation dialog
   */
  static showPermissionsDialog(): void {
    const message = `
Ứng dụng T-learn cần các quyền sau để hoạt động tốt:

• Thông báo: Để hiển thị báo thức khi đến giờ
• Báo thức chính xác: Để báo thức hoạt động ngay cả khi thiết bị ngủ
• Rung: Để rung thiết bị khi báo thức

Vui lòng cấp quyền để sử dụng đầy đủ tính năng báo thức.
    `;
    
    alert(message);
  }

  /**
   * Initialize all required permissions
   */
  static async initializePermissions(): Promise<{
    notifications: boolean;
    exactAlarms: boolean;
  }> {
    console.log('Initializing permissions...');
    
    // Request notification permissions
    const notificationsGranted = await this.requestNotificationPermissions();
    
    if (!notificationsGranted) {
      this.showPermissionsDialog();
    }
    
    // Request exact alarm permissions (handled by native code)
    await this.requestExactAlarmPermissions();
    
    return {
      notifications: notificationsGranted,
      exactAlarms: true // We assume this is granted by MainActivity
    };
  }
}
