import 'package:go_router/go_router.dart';

import '../pages/device_page.dart';
import '../pages/home_page.dart';
import '../pages/keamanan_page.dart';
import '../pages/location_page.dart';
import '../pages/network_page.dart';
import '../pages/note_form_page.dart';
import '../pages/notes_page.dart';
import '../pages/sensor_page.dart';
import '../pages/sinkron_page.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    // Hari 1
    GoRoute(
      path: '/catatan',
      builder: (context, state) => const NotesPage(),
    ),
    GoRoute(
      path: '/catatan/baru',
      builder: (context, state) => const NoteFormPage(),
    ),
    GoRoute(
      path: '/lokasi',
      builder: (context, state) => const LocationPage(),
    ),
    // Hari 2
    GoRoute(
      path: '/sinkron',
      builder: (context, state) => const SinkronPage(),
    ),
    GoRoute(
      path: '/jaringan',
      builder: (context, state) => const NetworkPage(),
    ),
    GoRoute(
      path: '/sensor',
      builder: (context, state) => const SensorPage(),
    ),
    GoRoute(
      path: '/perangkat',
      builder: (context, state) => const DevicePage(),
    ),
    GoRoute(
      path: '/keamanan',
      builder: (context, state) => const KeamananPage(),
    ),
  ],
);
