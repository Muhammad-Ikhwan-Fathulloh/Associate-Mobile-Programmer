import 'package:flutter/material.dart';

import 'proyek_config.dart';
import 'router/app_router.dart';
import 'theme/tema.dart';

class AssociateMobileApp extends StatelessWidget {
  const AssociateMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: ProyekConfig.namaAplikasi,
      debugShowCheckedModeBanner: false,
      theme: Tema.terang(),
      routerConfig: appRouter,
    );
  }
}
