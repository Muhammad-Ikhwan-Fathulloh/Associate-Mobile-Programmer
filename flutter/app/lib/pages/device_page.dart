import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';

class DevicePage extends StatelessWidget {
  const DevicePage({super.key});

  Future<Map<String, String>> _ambilInfo() async {
    final plugin = DeviceInfoPlugin();

    if (Platform.isAndroid) {
      final info = await plugin.androidInfo;
      return {
        'Merek': info.brand,
        'Model': info.model,
        'Versi Android': '${info.version.release} (API ${info.version.sdkInt})',
        'Arsitektur CPU': info.supportedAbis.join(', '),
        'Perangkat keras': info.hardware,
      };
    }

    if (Platform.isIOS) {
      final info = await plugin.iosInfo;
      return {
        'Nama': info.name,
        'Model': info.utsname.machine,
        'Versi iOS': info.systemVersion,
      };
    }

    return {'Platform': Platform.operatingSystem};
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Informasi Perangkat')),
      body: FutureBuilder<Map<String, String>>(
        future: _ambilInfo(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Text('Gagal membaca informasi perangkat: ${snapshot.error}'),
            );
          }
          final entries = snapshot.data!.entries.toList();
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: entries.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final item = entries[index];
              return Card(
                child: ListTile(
                  title: Text(item.key),
                  subtitle: Text(item.value),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
