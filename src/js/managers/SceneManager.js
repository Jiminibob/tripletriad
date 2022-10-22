export class SceneManager {
  constructor(game, scenemap) {
    this._game = game;
    this._activeScene = false;
    Object.keys(scenemap).forEach(key => game.scene.add(key, scenemap[key]));
  }

  switchScene(scene) {
    if (this._activeScene) this._game.scene.stop(this._activeScene);
    this._activeScene = scene;
    this._game.scene.start(this._activeScene);
  }
}
