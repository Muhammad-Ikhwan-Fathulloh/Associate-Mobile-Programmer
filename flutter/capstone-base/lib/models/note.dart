class Note {
  const Note({
    this.id,
    required this.title,
    required this.content,
    this.latitude,
    this.longitude,
    required this.updatedAt,
    this.syncStatus = 'PENDING',
    this.serverId,
  });

  /// Membuat catatan baru dengan waktu saat ini.
  factory Note.baru({
    required String title,
    required String content,
    double? latitude,
    double? longitude,
  }) {
    return Note(
      title: title,
      content: content,
      latitude: latitude,
      longitude: longitude,
      updatedAt: DateTime.now().millisecondsSinceEpoch,
    );
  }

  final int? id;
  final String title;
  final String content;
  final double? latitude;
  final double? longitude;
  final int updatedAt;
  final String syncStatus;
  final int? serverId;

  Map<String, Object?> toMap() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'latitude': latitude,
      'longitude': longitude,
      'updated_at': updatedAt,
      'sync_status': syncStatus,
      'server_id': serverId,
    };
  }

  factory Note.fromMap(Map<String, Object?> map) {
    return Note(
      id: map['id'] as int?,
      title: map['title'] as String,
      content: map['content'] as String,
      latitude: (map['latitude'] as num?)?.toDouble(),
      longitude: (map['longitude'] as num?)?.toDouble(),
      updatedAt: map['updated_at'] as int,
      syncStatus: map['sync_status'] as String,
      serverId: map['server_id'] as int?,
    );
  }

  /// Teks koordinat, atau [kosong] bila catatan tidak punya lokasi.
  String koordinat({String kosong = 'Tanpa lokasi'}) {
    final lat = latitude;
    final lon = longitude;
    if (lat == null || lon == null) return kosong;
    return '${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}';
  }
}
