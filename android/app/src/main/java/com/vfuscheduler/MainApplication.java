package com.vfuscheduler;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.oney.gcm.GcmPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.oney.gcm.GcmPackage;
import io.neson.react.notification.NotificationPackage;
import me.neo.react.StatusBarPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new GcmPackage(),
          new NotificationPackage(),
          new StatusBarPackage(),
          new RCTSplashScreenPackage(MainActivity.mainActivity)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
