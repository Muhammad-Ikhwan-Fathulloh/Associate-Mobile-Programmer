import 'package:flutter/material.dart';

import 'router/app_router.dart';
import 'theme/tema.dart';

class AssociateMobileApp extends StatelessWidget {
  const AssociateMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Catatan Lokasi',
      debugShowCheckedModeBanner: false,
      theme: Tema.terang(),
      routerConfig: appRouter,
    );
  }
}
